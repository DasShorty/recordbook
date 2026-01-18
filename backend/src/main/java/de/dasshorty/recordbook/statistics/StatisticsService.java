package de.dasshorty.recordbook.statistics;

import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import de.dasshorty.recordbook.book.Book;
import de.dasshorty.recordbook.book.BookRepository;
import de.dasshorty.recordbook.book.week.BookWeek;
import de.dasshorty.recordbook.book.week.BookWeekRepository;
import de.dasshorty.recordbook.book.week.day.BookDay;
import de.dasshorty.recordbook.book.week.day.Presence;
import de.dasshorty.recordbook.book.week.day.PresenceLocation;
import de.dasshorty.recordbook.statistics.dto.*;
import de.dasshorty.recordbook.user.UserRepository;
import de.dasshorty.recordbook.user.UserType;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final BookRepository bookRepository;
    private final BookWeekRepository bookWeekRepository;
    private final UserRepository userRepository;
    private final JwtHandler jwtHandler;

    public StatisticsService(BookRepository bookRepository,
                             BookWeekRepository bookWeekRepository,
                             UserRepository userRepository,
                             JwtHandler jwtHandler) {
        this.bookRepository = bookRepository;
        this.bookWeekRepository = bookWeekRepository;
        this.userRepository = userRepository;
        this.jwtHandler = jwtHandler;
    }

    public Optional<UUID> extractUserIdFromToken(String accessToken) {
        return this.jwtHandler.extractUserId(accessToken);
    }

    @Cacheable(value = "trainee-stats", key = "#userId")
    @Transactional(readOnly = true)
    public TraineeStatisticsDto getTraineeStatistics(UUID userId) {
        var userOpt = this.userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return createEmptyTraineeStats();
        }

        var bookOpt = this.bookRepository.getBookByTrainee(userOpt.get());
        if (bookOpt.isEmpty()) {
            return createEmptyTraineeStats();
        }

        Book book = bookOpt.get();
        List<BookWeek> weeks = book.getWeeks();

        long totalWeeks = weeks.size();
        long completedWeeks = weeks.stream().filter(BookWeek::isLocked).count();
        long signedWeeks = weeks.stream().filter(w -> w.getSignedFromTrainer() != null).count();
        long pendingSignatureWeeks = completedWeeks - signedWeeks;

        List<BookDay> allDays = weeks.stream()
                .flatMap(w -> w.getDays().stream())
                .toList();

        long totalMinutesAll = allDays.stream()
                .mapToLong(d -> d.getHours() * 60L + d.getMinutes())
                .sum();
        long totalHours = totalMinutesAll / 60;
        long totalMinutes = totalMinutesAll % 60;

        PresenceStatisticsDto presenceStats = calculatePresenceStatistics(allDays);
        LocationStatisticsDto locationStats = calculateLocationStatistics(allDays);
        List<WeeklyHoursDto> weeklyHours = calculateWeeklyHours(weeks);

        return new TraineeStatisticsDto(
                totalWeeks,
                completedWeeks,
                signedWeeks,
                pendingSignatureWeeks,
                totalHours,
                totalMinutes,
                presenceStats,
                locationStats,
                weeklyHours
        );
    }

    @Cacheable(value = "trainer-stats", key = "#userId")
    @Transactional(readOnly = true)
    public TrainerStatisticsDto getTrainerStatistics(UUID userId) {
        long assignedTrainees = this.bookRepository.countByTrainerId(userId);
        List<BookWeek> pendingWeeks = this.bookWeekRepository.findPendingSignatureWeeksByTrainerId(userId);
        long signedWeeks = this.bookWeekRepository.countSignedWeeksByTrainerId(userId);

        return new TrainerStatisticsDto(
                assignedTrainees,
                pendingWeeks.size(),
                signedWeeks
        );
    }

    @Cacheable(value = "admin-stats")
    @Transactional(readOnly = true)
    public AdminStatisticsDto getAdminStatistics() {
        long totalUsers = this.userRepository.count();
        long totalTrainees = this.userRepository.countByUserType(UserType.TRAINEE);
        long totalTrainers = this.userRepository.countByUserType(UserType.TRAINER);
        long totalBooks = this.bookRepository.count();
        long totalWeeks = this.bookWeekRepository.count();
        long completedWeeks = this.bookWeekRepository.countByLocked(true);

        return new AdminStatisticsDto(
                totalUsers,
                totalTrainees,
                totalTrainers,
                totalBooks,
                totalWeeks,
                completedWeeks
        );
    }

    private TraineeStatisticsDto createEmptyTraineeStats() {
        return new TraineeStatisticsDto(
                0, 0, 0, 0, 0, 0,
                new PresenceStatisticsDto(0, 0, 0, 0),
                new LocationStatisticsDto(0, 0, 0),
                List.of()
        );
    }

    private PresenceStatisticsDto calculatePresenceStatistics(List<BookDay> days) {
        Map<Presence, Long> presenceCounts = days.stream()
                .filter(d -> d.getPresence() != null)
                .collect(Collectors.groupingBy(BookDay::getPresence, Collectors.counting()));

        return new PresenceStatisticsDto(
                presenceCounts.getOrDefault(Presence.PRESENT, 0L),
                presenceCounts.getOrDefault(Presence.VACATION, 0L),
                presenceCounts.getOrDefault(Presence.ABSENCE, 0L),
                presenceCounts.getOrDefault(Presence.COMPENSATORY_TIME, 0L)
        );
    }

    private LocationStatisticsDto calculateLocationStatistics(List<BookDay> days) {
        Map<PresenceLocation, Long> locationCounts = days.stream()
                .filter(d -> d.getPresenceLocation() != null)
                .collect(Collectors.groupingBy(BookDay::getPresenceLocation, Collectors.counting()));

        return new LocationStatisticsDto(
                locationCounts.getOrDefault(PresenceLocation.WORK, 0L),
                locationCounts.getOrDefault(PresenceLocation.SCHOOL, 0L),
                locationCounts.getOrDefault(PresenceLocation.GUIDANCE, 0L)
        );
    }

    private List<WeeklyHoursDto> calculateWeeklyHours(List<BookWeek> weeks) {
        return weeks.stream()
                .sorted(Comparator.comparingInt(BookWeek::getYear)
                        .thenComparingInt(BookWeek::getCalendarWeek))
                .map(week -> {
                    long totalMinutesWeek = week.getDays().stream()
                            .mapToLong(d -> d.getHours() * 60L + d.getMinutes())
                            .sum();
                    return new WeeklyHoursDto(
                            week.getCalendarWeek(),
                            week.getYear(),
                            totalMinutesWeek / 60,
                            totalMinutesWeek % 60
                    );
                })
                .toList();
    }
}

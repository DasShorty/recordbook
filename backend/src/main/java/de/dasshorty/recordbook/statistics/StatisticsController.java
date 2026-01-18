package de.dasshorty.recordbook.statistics;

import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.statistics.dto.AdminStatisticsDto;
import de.dasshorty.recordbook.statistics.dto.TraineeStatisticsDto;
import de.dasshorty.recordbook.statistics.dto.TrainerStatisticsDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/trainee")
    @PreAuthorize("hasAuthority('TRAINEE')")
    public ResponseEntity<?> getTraineeStatistics(@CookieValue("access_token") String accessToken) {
        var userIdOpt = this.statisticsService.extractUserIdFromToken(accessToken);
        if (userIdOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResult("Invalid token", "access_token"));
        }

        UUID userId = userIdOpt.get();
        TraineeStatisticsDto statistics = this.statisticsService.getTraineeStatistics(userId);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/trainer")
    @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMINISTRATOR')")
    public ResponseEntity<?> getTrainerStatistics(@CookieValue("access_token") String accessToken) {
        var userIdOpt = this.statisticsService.extractUserIdFromToken(accessToken);
        if (userIdOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResult("Invalid token", "access_token"));
        }

        UUID userId = userIdOpt.get();
        TrainerStatisticsDto statistics = this.statisticsService.getTrainerStatistics(userId);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public ResponseEntity<AdminStatisticsDto> getAdminStatistics() {
        AdminStatisticsDto statistics = this.statisticsService.getAdminStatistics();
        return ResponseEntity.ok(statistics);
    }
}

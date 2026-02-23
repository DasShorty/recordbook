package de.dasshorty.recordbook.pdf;

import de.dasshorty.recordbook.book.WeekDateHelper;
import de.dasshorty.recordbook.book.week.BookWeek;
import de.dasshorty.recordbook.book.week.day.BookDay;
import de.dasshorty.recordbook.book.week.day.Presence;
import de.dasshorty.recordbook.book.week.day.PresenceLocation;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

import java.awt.*;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

public class PdfSiteConverter {

    private final PDDocument pdDocument;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    private static final Locale GERMAN_LOCALE = Locale.GERMAN;

    public PdfSiteConverter(PDDocument pdDocument) {
        this.pdDocument = pdDocument;
    }

    public void addWeekPage(BookWeek week) throws IOException {

        PDPage page = new PDPage(PDRectangle.A4);
        this.pdDocument.addPage(page);

        PDPageContentStream contentStream = new PDPageContentStream(this.pdDocument, page);

        var font = PdfFontManager.getInterNormal(this.pdDocument);
        var semiBold = PdfFontManager.getSemiBoldInter(this.pdDocument);

        // Background image
        PDImageXObject backgroundImage = PDImageXObject.createFromByteArray(
            this.pdDocument,
            PdfAssetHandler.loadAssetAsByteArray("jpeg/pdf-export_page-background.jpg"),
            "default_background_svg_image"
        );
        contentStream.drawImage(backgroundImage, 0, 0, page.getMediaBox().getWidth(), page.getMediaBox().getHeight());

        // Header section
        float pageWidth = page.getMediaBox().getWidth();
        float centerX = pageWidth / 2;

        PdfItemManager.addCenteredText(contentStream, "WOCHENÜBERSICHT", centerX, 740, semiBold, 24);

        var fromDate = WeekDateHelper.getFirstDayOfWeek(week.getYear(), week.getCalendarWeek());
        var toDate = WeekDateHelper.getLastDayOfWeek(week.getYear(), week.getCalendarWeek());

        var fromDateString = fromDate.format(DATE_FORMATTER);
        var toDateString = toDate.format(DATE_FORMATTER);

        PdfItemManager.addCenteredText(contentStream, fromDateString + " - " + toDateString, centerX, 715, font, 14);
        PdfItemManager.addCenteredText(contentStream, "Kalenderwoche " + week.getCalendarWeek() + " – Jahr " + week.getYear(), centerX, 695, font, 14);

        // Purple header rectangle for activities section
        Color purpleHeaderColor = new Color(225, 210, 249, 50);
        PdfItemManager.drawRectangle(contentStream, 0, 545, (int) pageWidth, 130, purpleHeaderColor);

        // Week activities section
        float activitiesY = 640;
        PdfItemManager.addText(contentStream, "Wochenaktivitäten", 120, activitiesY, semiBold, 14);

        // Add week text/activities (with word wrapping if needed)
        String weekText = week.getText() != null ? week.getText() : "";
        if (!weekText.isEmpty()) {
            String[] lines = wrapText(weekText, 450, font, 12);
            float lineHeight = 15;
            float textY = activitiesY - 20;
            for (String line : lines) {
                PdfItemManager.addText(contentStream, line, 120, textY, font, 12);
                textY -= lineHeight;
                if (textY < 550) break; // Don't overflow into day section
            }
        }

        // Days table section
        float tableStartY = 490;
        float rowHeight = 43;
        float leftMargin = 120;

        // Table headers
        PdfItemManager.addText(contentStream, "Tag", leftMargin, tableStartY + 5, semiBold, 14);
        PdfItemManager.addText(contentStream, "Anwesenheit", 215, tableStartY + 5, semiBold, 14);
        PdfItemManager.addText(contentStream, "Ort", 330, tableStartY + 5, semiBold, 14);
        PdfItemManager.addText(contentStream, "Zeit", 425, tableStartY + 5, semiBold, 14);

        // Sort days by date
        List<BookDay> sortedDays = week.getDays().stream()
                .sorted(Comparator.comparing(BookDay::getDate))
                .toList();

        // Draw each day
        float currentY = tableStartY - rowHeight;
        for (BookDay day : sortedDays) {
            drawDayRow(contentStream, day, leftMargin, currentY, font);
            currentY -= rowHeight;
        }

        // Trainer signature section
        if (week.getSignedFromTrainer() != null) {
            float signatureY = 100;
            var trainer = week.getSignedFromTrainer();
            String trainerName = trainer.getForename() + " " + trainer.getSurname();
            String signatureText = String.format(
                "Ausbilder %s hat die Woche %d am %s angenommen",
                trainerName,
                week.getCalendarWeek(),
                toDateString
            );
            PdfItemManager.addCenteredText(contentStream, signatureText, centerX, signatureY, font, 10);
        }

        contentStream.close();
    }

    private void drawDayRow(PDPageContentStream contentStream, BookDay day, float x, float y,
                           PDType0Font font) throws IOException {
        LocalDate date = day.getDate();

        // Day name and date
        String dayName = date.getDayOfWeek().getDisplayName(TextStyle.FULL, GERMAN_LOCALE);
        dayName = dayName.substring(0, 1).toUpperCase() + dayName.substring(1);

        PdfItemManager.addText(contentStream, dayName, x, y + 17, font, 14);
        PdfItemManager.addText(contentStream, date.format(DATE_FORMATTER), x, y + 3, font, 9);

        // Presence status
        String presenceText = formatPresence(day.getPresence());
        PdfItemManager.addText(contentStream, presenceText, x + 95, y + 10, font, 14);

        // Location
        String locationText = formatLocation(day.getPresenceLocation());
        PdfItemManager.addText(contentStream, locationText, x + 210, y + 10, font, 14);

        // Hours
        String hoursText = String.format("%02dh:%02dm", day.getHours(), day.getMinutes());
        PdfItemManager.addText(contentStream, hoursText, x + 305, y + 10, font, 14);
    }

    private String formatPresence(Presence presence) {
        if (presence == null) return "-";
        return switch (presence) {
            case PRESENT -> "anwesend";
            case VACATION -> "Urlaub";
            case COMPENSATORY_TIME -> "Ausgleichszeit";
            case ABSENCE -> "abwesend";
        };
    }

    private String formatLocation(PresenceLocation location) {
        if (location == null) return "-";
        return switch (location) {
            case WORK -> "Betrieb";
            case SCHOOL -> "Schule";
            case GUIDANCE -> "Anleitung";
        };
    }

    private String[] wrapText(String text, int maxWidth, PDType0Font font, int fontSize) throws IOException {
        String[] words = text.split(" ");
        StringBuilder currentLine = new StringBuilder();
        var lines = new java.util.ArrayList<String>();

        for (String word : words) {
            String testLine = currentLine.isEmpty() ? word : currentLine + " " + word;
            float width = font.getStringWidth(testLine) / 1000 * fontSize;

            if (width > maxWidth && !currentLine.isEmpty()) {
                lines.add(currentLine.toString());
                currentLine = new StringBuilder(word);
            } else {
                if (!currentLine.isEmpty()) currentLine.append(" ");
                currentLine.append(word);
            }
        }

        if (!currentLine.isEmpty()) {
            lines.add(currentLine.toString());
        }

        return lines.toArray(new String[0]);
    }
}

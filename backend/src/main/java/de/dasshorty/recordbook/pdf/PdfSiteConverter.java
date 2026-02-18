package de.dasshorty.recordbook.pdf;

import de.dasshorty.recordbook.book.WeekDateHelper;
import de.dasshorty.recordbook.book.week.BookWeek;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

import java.awt.*;
import java.io.IOException;

public class PdfSiteConverter {

    private final PDDocument pdDocument;

    public PdfSiteConverter(PDDocument pdDocument) {
        this.pdDocument = pdDocument;
    }

    public void addWeekPage(BookWeek week) throws IOException {

        PDPage page = new PDPage(PDRectangle.A4);

        this.pdDocument.addPage(page);

        PDPageContentStream contentStream = new PDPageContentStream(this.pdDocument, page);

        var font = PdfFontManager.getInterNormal(this.pdDocument);
        var semiBold = PdfFontManager.getSemiBoldInter(this.pdDocument);

        PDImageXObject backgroundImage = PDImageXObject.createFromByteArray(this.pdDocument, PdfAssetHandler.loadAssetAsByteArray("jpeg/pdf-export_page-background.jpg"), "default_background_svg_image");
        contentStream.drawImage(backgroundImage, 0, 0, page.getMediaBox().getWidth(), page.getMediaBox().getHeight());

        PdfItemManager.addCenteredText(contentStream, "WOCHENÜBERSICHT", 300, 740, semiBold, 24);
        PdfItemManager.addCenteredText(contentStream, "WOCHE " + week.getCalendarWeek() + "/" + week.getYear(), 300, 715, font, 16);

        var fromDate = WeekDateHelper.getFirstDayOfWeek(week.getYear(), week.getCalendarWeek());
        var toDate = WeekDateHelper.getLastDayOfWeek(week.getYear(), week.getCalendarWeek());

        var fromDateString = fromDate.getDayOfMonth() + "." + fromDate.getMonthValue() + "." + fromDate.getYear();
        var toDateString = toDate.getDayOfMonth() + "." + toDate.getMonthValue() + "." + toDate.getYear();

        PdfItemManager.addCenteredText(contentStream, fromDateString + " - " + toDateString, 300, 700, font, 12);

        Color color = new Color(245, 240, 255, 19);

        PdfItemManager.drawRectangle(contentStream, 0, 500, (int) page.getMediaBox().getWidth(), 50, color);

        contentStream.close();
    }


}

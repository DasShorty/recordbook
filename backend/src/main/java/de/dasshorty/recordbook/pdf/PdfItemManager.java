package de.dasshorty.recordbook.pdf;

import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;

import java.awt.*;
import java.io.IOException;

public class PdfItemManager {

    public static void drawRectangle(PDPageContentStream contentStream, int x, int y, int width, int height, Color color) throws IOException {
        contentStream.addRect(x, y, width, height);
        contentStream.setStrokingColor(color);
        contentStream.setNonStrokingColor(color);
        contentStream.fill();
        contentStream.stroke();
    }

    public static void addText(PDPageContentStream contentStream, String text, int x, int y, PDFont font, int fontSize) throws IOException {
        contentStream.beginText();
        contentStream.setFont(font, fontSize);
        contentStream.setNonStrokingColor(0, 0, 0);
        contentStream.newLineAtOffset(x, y);
        contentStream.showText(text);
        contentStream.endText();
    }


    public static void addCenteredText(PDPageContentStream contentStream, String text, int x, int y, PDFont font, int fontSize) throws IOException {
        float textWidth = font.getStringWidth(text) / 1000 * fontSize;
        float centeredX = x - (textWidth / 2);

        contentStream.beginText();
        contentStream.setFont(font, fontSize);
        contentStream.setNonStrokingColor(0, 0, 0);
        contentStream.newLineAtOffset(centeredX, y);
        contentStream.showText(text);
        contentStream.endText();
    }

}

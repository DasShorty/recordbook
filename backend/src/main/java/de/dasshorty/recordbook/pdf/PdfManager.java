package de.dasshorty.recordbook.pdf;

import de.dasshorty.recordbook.book.Book;
import org.apache.pdfbox.pdmodel.PDDocument;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class PdfManager {

    public static ByteArrayOutputStream createPdf(Book book) throws IOException {

        PDDocument document = new PDDocument();


        PdfSiteConverter pdfSiteConverter = new PdfSiteConverter(document);
        book.getWeeks().forEach(bookWeek -> {

            try {
                pdfSiteConverter.addWeekPage(bookWeek);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

        });

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        document.save(outputStream);
        document.close();

        return outputStream;
    }

}

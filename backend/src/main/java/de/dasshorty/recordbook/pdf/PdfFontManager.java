package de.dasshorty.recordbook.pdf;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.font.PDType0Font;

import java.io.IOException;

public class PdfFontManager {

    public static PDType0Font getInterNormal(PDDocument pdDocument) throws IOException {
        return  PDType0Font.load(pdDocument, PdfAssetHandler.loadAssetAsInputStream("fonts/Inter-Variable.ttf"));
    }

    public static PDType0Font getSemiBoldInter(PDDocument pdDocument) throws IOException {
        return  PDType0Font.load(pdDocument, PdfAssetHandler.loadAssetAsInputStream("fonts/Inter_24pt-SemiBold.ttf"));
    }

}

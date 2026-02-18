package de.dasshorty.recordbook.pdf;

import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

public class PdfAssetHandler {

    public static InputStream loadAssetAsInputStream(String filename) throws IOException {
        ClassPathResource resource = new ClassPathResource("assets/" + filename);
        return resource.getInputStream();
    }

    public static byte[] loadAssetAsByteArray(String filename) throws IOException {
        try (InputStream is = loadAssetAsInputStream(filename)) {
            return is.readAllBytes();
        }
    }

}

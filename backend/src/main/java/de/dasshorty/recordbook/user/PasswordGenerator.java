package de.dasshorty.recordbook.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.SecureRandom;

public class PasswordGenerator {

    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIALS = "!@#$%^&*()-_=+[]{};:,.<>?";
    private static final String ALL = UPPERCASE + LOWERCASE + DIGITS + SPECIALS;

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Logger log = LoggerFactory.getLogger(PasswordGenerator.class);

    private static char randomChar(String charBase) {

        int length = charBase.length();
        int randomSeed = secureRandom.nextInt(0, length);
        return charBase.charAt(randomSeed);

    }

    public static String generateRandomPassword(int length) {

        int randomLength = length - 4;

        StringBuilder password = new StringBuilder(length);

        password.append(randomChar(UPPERCASE));
        password.append(randomChar(LOWERCASE));
        password.append(randomChar(DIGITS));
        password.append(randomChar(SPECIALS));

        for (int i = 0; i < randomLength; i++) {
            password.append(randomChar(ALL));
        }

        String s = shuffleString(password.toString());

        log.warn("Generated password: {}", s);

        return s;
    }

    private static String shuffleString(String input) {
        char[] a = input.toCharArray();
        for (int i = a.length - 1; i > 0; i--) {
            int j = secureRandom.nextInt(i + 1);
            char tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return new String(a);
    }

}

package de.dasshorty.recordbook.http.handler;

import java.util.regex.Pattern;

public class UserInputHandler {

    public static boolean isEmail(String email) {
        return Pattern.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", email);
    }

    public static boolean validInteger(Integer integer) {
        return integer != null && integer >= 0;
    }

}

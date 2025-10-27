package de.dasshorty.recordbook.user;

public enum UserType {

    TRAINEE,
    TRAINER,
    COMPANY;

    public Authority getAuthority() {

        switch (this) {
            case COMPANY -> {
                return Authority.COMPANY;
            }
            case TRAINEE -> {
                return Authority.TRAINEE;
            }
            case TRAINER -> {
                return Authority.TRAINER;
            }
        }

        return Authority.NONE;
    }

}

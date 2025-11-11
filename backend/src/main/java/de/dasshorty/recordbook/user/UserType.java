package de.dasshorty.recordbook.user;

public enum UserType {

    TRAINEE,
    TRAINER,
    COMPANY;

    public Authority getAuthority() {
        return switch (this) {
            case COMPANY -> Authority.COMPANY;
            case TRAINEE -> Authority.TRAINEE;
            case TRAINER -> Authority.TRAINER;
        };
    }

}

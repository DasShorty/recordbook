package de.dasshorty.recordbook.user;

public enum UserType {
    TRAINEE,
    TRAINER;

    public Authority getAuthority() {
        return switch (this) {
            case TRAINEE -> Authority.TRAINEE;
            case TRAINER -> Authority.TRAINER;
        };
    }
}

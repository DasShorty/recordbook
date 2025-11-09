package de.dasshorty.recordbook.http.result;

import java.util.UUID;

public record OptionData<T>(UUID id, T name) {
}

package de.dasshorty.recordbook.http.result;

import java.util.List;

public record QueryResult<T>(long total, int limit, int offset, List<T> data) {
}

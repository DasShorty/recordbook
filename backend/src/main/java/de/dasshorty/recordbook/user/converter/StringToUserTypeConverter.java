package de.dasshorty.recordbook.user.converter;

import de.dasshorty.recordbook.user.UserType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class StringToUserTypeConverter implements Converter<String, UserType> {

    @Override
    public UserType convert(@Nullable String source) {
        if (source == null || source.isBlank()) {
            return null;
        }

        return UserType.valueOf(source.toUpperCase());
    }
}

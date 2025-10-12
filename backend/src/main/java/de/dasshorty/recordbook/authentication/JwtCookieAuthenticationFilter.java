package de.dasshorty.recordbook.authentication;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtCookieAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if (request.getHeader("Authorization") != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = null;

        if (request.getCookies() == null) {
            filterChain.doFilter(request, response);
            return;
        }

        for (Cookie cookie : request.getCookies()) {

            if ("access_token".equals(cookie.getName())) {
                jwt = cookie.getValue();
            }

            if ("refresh_token".equals(cookie.getName())) {
                if (jwt != null) {
                    continue;
                }

                jwt = cookie.getValue();
            }

        }

        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        final String finalJwt = jwt;

        HttpServletRequest wrappedRequest = new HttpServletRequestWrapper(request) {
            @Override
            public String getHeader(String name) {
                if ("Authorization".equalsIgnoreCase(name)) {
                    return "Bearer " + finalJwt;
                }
                return super.getHeader(name);
            }
        };


        filterChain.doFilter(wrappedRequest, response);
    }
}

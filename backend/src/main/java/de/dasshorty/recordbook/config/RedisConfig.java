package de.dasshorty.recordbook.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.Objects;

@Configuration
@EnableCaching
public class RedisConfig {

    private RedisCacheManager cacheManager;

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {

        // Use the thread context classloader to ensure DevTools compatibility
        JdkSerializationRedisSerializer serializer = new JdkSerializationRedisSerializer(
                Thread.currentThread().getContextClassLoader()
        );

        RedisCacheConfiguration cacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(30))
                .disableCachingNullValues()
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(serializer)
                );

        this.cacheManager = RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(cacheConfiguration)
                .withCacheConfiguration("trainee-stats", cacheConfiguration)
                .withCacheConfiguration("trainer-stats", cacheConfiguration)
                .withCacheConfiguration("admin-stats", cacheConfiguration)
                .build();

        return this.cacheManager;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void clearCacheOnStartup() {
        // Clear all statistics caches on startup to prevent ClassLoader issues with DevTools
        Objects.requireNonNull(this.cacheManager.getCache("trainee-stats")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("trainer-stats")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("admin-stats")).clear();
    }
}

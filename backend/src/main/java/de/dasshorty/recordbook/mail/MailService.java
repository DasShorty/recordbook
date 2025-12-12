package de.dasshorty.recordbook.mail;

import de.dasshorty.recordbook.user.dto.UserDto;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Service
public class MailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    @Value("${spring.mail.username}")
    private String username;
    @Value("${frontend.domain}")
    private String frontendDomain;

    @Autowired
    public MailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Async("mailTaskExecutor")
    public void sendNewUserMail(UserDto user, String password) {
        MimeMessage mimeMessage = this.mailSender.createMimeMessage();

        try {

            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            Context ctx = new Context();
            ctx.setVariable("user", user);
            ctx.setVariable("password", password);
            ctx.setVariable("login", this.frontendDomain + "/login");

            String htmlContent = this.templateEngine.process("mail/new-user", ctx);

            helper.setFrom(this.username);
            helper.setReplyTo(this.username);
            helper.setTo(user.email());
            helper.setSubject("Digitales Berichtsheft - Benutzer angelegt");
            helper.setText(String.format("""
                    Digitales Berichtsheft
                    
                    Sie wurden als neuer Nutzer hinzugefügt
                    
                    Benutzername: %s
                    Passwort: %s
                    
                    Anmelden können Sie sich unter %s
                    """, user.email(), password, this.frontendDomain + "/login"), htmlContent);
            helper.setSentDate(new Date());

            this.mailSender.send(mimeMessage);

        } catch (MessagingException | MailSendException e) {
            log.warn("Fehler beim Senden der neuen Benutzer\\-Mail an {}: {}", user.email(), e.getMessage());
        }
    }


}

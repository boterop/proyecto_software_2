package com.uq.software.service;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
  private final JavaMailSender mailSender;

  public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
    this.mailSender = mailSenderProvider.getIfAvailable();
  }

  public void send(String to, String subject, String body) {
    if (mailSender == null) {
      useLocal(to, subject, body);
      return;
    }
    useSMTP(to, subject, body);
  }

  private void useLocal(String to, String subject, String body) {
    System.out.println("to: " + to);
    System.out.println("subject: " + subject);
    System.out.println("body: " + body);
  }

  private void useSMTP(String to, String subject, String body) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(to);
    message.setSubject(subject);
    message.setText(body);

    mailSender.send(message);
  }
}

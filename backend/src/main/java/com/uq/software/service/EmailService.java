package com.uq.software.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
  public void send(String to, String subject, String body) {
    System.out.println("to: " + to);
    System.out.println("subject: " + subject);
    System.out.println("body: " + body);
  }
}

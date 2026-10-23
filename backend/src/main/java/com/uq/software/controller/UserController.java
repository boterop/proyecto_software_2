package com.uq.software.controller;

import com.uq.software.dto.UserResponse;
import com.uq.software.entity.User;
import com.uq.software.service.UserService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<List<UserResponse>> list() {
    return ResponseEntity.ok(userService.findAll().stream().map(this::toResponse).toList());
  }

  private UserResponse toResponse(User user) {
    return userService.toResponse(user);
  }
}

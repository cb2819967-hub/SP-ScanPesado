package com.scanpesado.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    @RequestMapping({"/login", "/dashboard", "/dashboard/{*path}"})
    public String spa() {
        return "forward:/index.html";
    }
}

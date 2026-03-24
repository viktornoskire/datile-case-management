package dev.datile.controller;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void login_should_return_jwt() throws Exception {
        String body = """
                {
                    "email": "jimmy@gmail.com",
                    "password": "password"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("jwt"));
    }

    @Test
    void me_should_return_username_when_present() throws Exception {
        String body = """
                {
                    "email": "ronja@gmail.com",
                    "password": "password"
                }
                """;
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andReturn();

        Cookie jwtCookie = result.getResponse().getCookie("jwt");

        mockMvc.perform(get("/api/auth/me")
                        .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("ronja@gmail.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void me_should_return_401_when_not_present() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void errands_should_return_401_when_not_present() throws Exception {
        mockMvc.perform(get("/api/errands"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void logout_should_remove_jwt_cookie() throws Exception {
        String body = """
                {
                    "email": "viktor@gmail.com",
                    "password": "password"
                }
                """;
        MvcResult result =  mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(cookie().exists("jwt"))
                .andReturn();

        Cookie jwtCookie = result.getResponse().getCookie("jwt");

        mockMvc.perform(post("/api/auth/logout")
                .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(cookie().value("jwt", ""))
                .andExpect(cookie().maxAge("jwt", 0));
    }

    @Test
    void logout_should_remove_jwt_cookie_and_return_401_on_errands() throws Exception {
        String body = """
                {
                    "email": "viktor@gmail.com",
                    "password": "password"
                }
                """;
        MvcResult result =  mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(cookie().exists("jwt"))
                .andReturn();

        Cookie jwtCookie = result.getResponse().getCookie("jwt");

        mockMvc.perform(post("/api/auth/logout")
                        .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(cookie().value("jwt", ""))
                .andExpect(cookie().maxAge("jwt", 0));

        mockMvc.perform(get("/api/errands"))
                .andExpect(status().isUnauthorized());
    }

}

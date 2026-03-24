package dev.datile.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.datile.domain.Assignee;
import dev.datile.domain.User;
import dev.datile.dto.users.UserResponse;
import jakarta.servlet.http.Cookie;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test")
public class UserControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    Flyway flyway;

    @Autowired
    ObjectMapper objectMapper;

    Cookie jwtCookie;

    @BeforeEach
    void setUp() throws Exception {
        // Reset database to Flyway baseline
        flyway.clean();
        flyway.migrate();

        // Login and extract JWT cookie
        String body = """
                {
                    "email": "jimmy@gmail.com",
                    "password": "password"
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("jwt"))
                .andReturn();

        jwtCookie = result.getResponse().getCookie("jwt");
    }

    @Test
    void getAllUsers_should_return_all_users() throws Exception {
        mockMvc.perform(get("/api/users")
                        .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("jimmy"));
    }

    @Test
    void getAllUsers_should_return_401_when_not_present() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void post_user_should_return_user() throws Exception {
        String body = """
                {
                    "name": "johan",
                    "email": "johan@gmail.com",
                    "password": "password",
                    "role": "ADMIN"
                }
                """;

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .cookie(jwtCookie))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.name").value("johan"));
    }

    @Test
    void post_user_with_role_user_should_return_401() throws Exception {
        String loginBody = """
                {
                    "email": "viktor@gmail.com",
                    "password": "password"
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("jwt"))
                .andReturn();

        Cookie temporaryCookie = result.getResponse().getCookie("jwt");

        String postBody = """
                {
                    "name": "johan",
                    "email": "johan@gmail.com",
                    "password": "password",
                    "role": "ADMIN"
                }
                """;

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postBody)
                        .cookie(temporaryCookie))
                .andExpect(status().isForbidden());
    }

    @Test
    void post_existing_user_should_return_409() throws Exception {
        String body = """
                {
                    "name": "johan",
                    "email": "johan@gmail.com",
                    "password": "password",
                    "role": "ADMIN"
                }
                """;

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .cookie(jwtCookie))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .cookie(jwtCookie))
                .andExpect(status().isConflict());

    }

    @Test
    void put_user_should_return_ok() throws Exception {
        String body = """
                {
                    "name": "johan",
                    "email": "johan@gmail.com",
                    "password": "password",
                    "role": "ADMIN"
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .cookie(jwtCookie))
                .andExpect(status().isCreated())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        JsonNode root = objectMapper.readTree(json);
        JsonNode userNode = root.get("user");

        UserResponse user = objectMapper.treeToValue(userNode, UserResponse.class);
        Long id = user.id();

        String changed_body = """
                {
                    "name": "john",
                    "email": "john@gmail.com",
                    "password": "password",
                    "role": "ADMIN"
                }
                """;

        mockMvc.perform(put("/api/users/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(changed_body)
                .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.name").value("john"));
    }
}
package dev.datile.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.datile.domain.Assignee;
import jakarta.servlet.http.Cookie;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
public class AssigneeControllerTest {

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
    void get_all_assignees_should_return_all_assignees() throws Exception {
        mockMvc.perform(get("/api/assignees")
                        .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].name").value("Jimmy"));
    }

    @Test
    void get_all_assignees_should_return_401_when_not_present() throws Exception {
        mockMvc.perform(get("/api/assignees"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void post_assignee_should_return_assignee() throws Exception {
        String body = """
                {
                    "assigneeId": null,
                    "name": "johan"
                }
                """;

        mockMvc.perform(post("/api/assignees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .cookie(jwtCookie))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("johan"));
    }

    @Test
    void post_existing_assignee_should_return_409() throws Exception {
        String body = """
                {
                    "assigneeId": null,
                    "name": "johan"
                }
                """;

       MvcResult result = mockMvc.perform(post("/api/assignees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .cookie(jwtCookie))
                .andExpect(status().isCreated())
               .andReturn();
       String json = result.getResponse().getContentAsString();

       Assignee assignee = objectMapper.readValue(json, Assignee.class);
       Long id = assignee.getAssigneeId();

        String existing_body = String.format("""
                {
                    "assigneeId": %s,
                    "name": "johan"
                }
                """, id);

        mockMvc.perform(post("/api/assignees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(existing_body)
                        .cookie(jwtCookie))
                .andExpect(status().isConflict());

    }
}
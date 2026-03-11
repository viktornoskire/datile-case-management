package dev.datile.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/* Integration test to verify controller > service > repo > DB > JSON
 * Test to verify that GET /api/errands?statusIds=1 returns errands only with status 1
 * This verifies that the statusIds-filter works correctly
 * */

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ErrandControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void getErrands_filters_by_statusIds() throws Exception {
        mockMvc.perform(get("/api/errands")
                        .param("status", "Nytt")
                        .param("page", "0")
                        .param("size", "20")
                        .param("sortBy", "date")
                        .param("sortDir", "desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.errands.length()").value(1))
                .andExpect(jsonPath("$.errands[0].status.name").value("Nytt"));
    }
}
package dev.datile;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import javax.sql.DataSource;

import static org.assertj.core.api.Assertions.assertThat;

/* Integration test that verifies Flyway migrations run against the test database.
 * Flyway_schema_history is created.
 * Database is reachable */


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DatabaseIntegrationTest {

    @Autowired
    DataSource dataSource;
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    void flywayShouldHaveRun() {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .load();

        flyway.migrate();

        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history",
                Integer.class
        );
        assertThat(count).isNotNull();
        assertThat(count).isGreaterThanOrEqualTo(1);
    }
}
package de.dasshorty.recordbook.authentication;

import com.google.gson.Gson;
import de.dasshorty.recordbook.authentication.httpbodies.TokenBody;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationControllerTests {

    private static TokenBody tokenBody;
    @Autowired
    private MockMvc mockMvc;

    @BeforeAll
    static void obtainAccessToken(@Autowired MockMvc mockMvc) throws Exception {

        MvcResult result = mockMvc.perform(post("/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "anthony@eno-intern.de",
                                  "password": "test"
                                }
                                """))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        tokenBody = new Gson().fromJson(result.getResponse().getContentAsString(), TokenBody.class);
    }

    @Test
    void requireLoginBody() throws Exception {

        mockMvc.perform(post("/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

    }

    @Test
    void accountNotFound() throws Exception {
        mockMvc.perform(post("/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "lila@purple-company.tld",
                                  "password": "test"
                                }
                                """))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}

package de.dasshorty.recordbook.user;

import com.google.gson.Gson;
import de.dasshorty.recordbook.company.Company;
import de.dasshorty.recordbook.company.CompanyRepository;
import de.dasshorty.recordbook.user.dto.UserDto;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
public class UserControllerTests {

    private static String adminAccessToken;
    private static UUID testCompanyId;
    private static final Gson gson = new Gson();

    @Autowired
    private MockMvc mockMvc;

    @BeforeAll
    static void setup(@Autowired MockMvc mockMvc, @Autowired CompanyRepository companyRepository) throws Exception {
        // Login as administrator to get access token
        MvcResult adminResult = mockMvc.perform(post("/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "anthony@eno-intern.de",
                                  "password": "test"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn();

        Cookie accessToken = adminResult.getResponse().getCookie("access_token");

        Assertions.assertNotNull(accessToken);

        adminAccessToken = accessToken.getValue();

        Assertions.assertNotNull(adminAccessToken);

        // Create a test company
        Company testCompany = companyRepository.save(new Company("Test Company UserController", new ArrayList<>()));
        testCompanyId = testCompany.getId();
    }

    @Test
    void createUser_withValidData_shouldReturnCreated() throws Exception {
        String requestBody = String.format("""
                {
                  "forename": "John",
                  "surname": "Doe",
                  "email": "john.doe@test-e2e.com",
                  "userType": "TRAINEE",
                  "companyId": "%s"
                }
                """, testCompanyId);

        mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.forename").value("John"))
                .andExpect(jsonPath("$.surname").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@test-e2e.com"))
                .andExpect(jsonPath("$.userType").value("TRAINEE"))
                .andExpect(jsonPath("$.assignedCompany.id").value(testCompanyId.toString()));
    }

    @Test
    void createUser_withoutCompanyId_shouldReturnCreated() throws Exception {
        mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "forename": "Jane",
                                  "surname": "Smith",
                                  "email": "jane.smith@test-e2e.com",
                                  "userType": "COMPANY"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.forename").value("Jane"))
                .andExpect(jsonPath("$.surname").value("Smith"))
                .andExpect(jsonPath("$.email").value("jane.smith@test-e2e.com"))
                .andExpect(jsonPath("$.userType").value("COMPANY"))
                .andExpect(jsonPath("$.assignedCompany").doesNotExist());
    }

    @Test
    void createUser_withInvalidEmail_shouldReturnBadRequest() throws Exception {
        String requestBody = String.format("""
                {
                  "forename": "Invalid",
                  "surname": "User",
                  "email": "invalid-email",
                  "userType": "TRAINEE",
                  "companyId": "%s"
                }
                """, testCompanyId);

        mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createUser_withMissingForename_shouldReturnBadRequest() throws Exception {
        String requestBody = String.format("""
                {
                  "surname": "User",
                  "email": "test@test.com",
                  "userType": "TRAINEE",
                  "companyId": "%s"
                }
                """, testCompanyId);

        mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createUser_withMissingSurname_shouldReturnBadRequest() throws Exception {
        String requestBody = String.format("""
                {
                  "forename": "Test",
                  "email": "test@test.com",
                  "userType": "TRAINEE",
                  "companyId": "%s"
                }
                """, testCompanyId);

        mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createUser_withMissingUserType_shouldReturnBadRequest() throws Exception {
        String requestBody = String.format("""
                {
                  "forename": "Test",
                  "surname": "User",
                  "email": "test@test.com",
                  "companyId": "%s"
                }
                """, testCompanyId);

        mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createUser_withInvalidCompanyId_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "forename": "Test",
                                  "surname": "User",
                                  "email": "test2@test.com",
                                  "userType": "TRAINEE",
                                  "companyId": "00000000-0000-0000-0000-000000000000"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createUser_withoutAuthentication_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "forename": "Test",
                                  "surname": "User",
                                  "email": "test@test.com",
                                  "userType": "TRAINEE"
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    void getUsers_asAdmin_withoutCompanyId_shouldReturnAllUsers() throws Exception {
        mockMvc.perform(get("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .param("offset", "0")
                        .param("limit", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").exists())
                .andExpect(jsonPath("$.offset").value(0))
                .andExpect(jsonPath("$.limit").value(10))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));
    }

    @Test
    void getUsers_asAdmin_withCompanyId_shouldReturnCompanyUsers() throws Exception {
        mockMvc.perform(get("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .param("offset", "0")
                        .param("limit", "10")
                        .param("company", testCompanyId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").exists())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void getUsers_asAdmin_withInvalidCompanyId_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .param("offset", "0")
                        .param("limit", "10")
                        .param("company", "invalid-uuid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.property").value("companyId"));
    }

    @Test
    void getUsers_withUserType_shouldFilterByUserType() throws Exception {
        mockMvc.perform(get("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .param("offset", "0")
                        .param("limit", "10")
                        .param("company", testCompanyId.toString())
                        .param("userType", "TRAINEE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void getUsers_withoutAuthentication_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/users")
                        .param("offset", "0")
                        .param("limit", "10"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getUser_withValidId_shouldReturnUser() throws Exception {
        // First create a user to get
        String requestBody = String.format("""
                {
                  "forename": "GetTest",
                  "surname": "User",
                  "email": "gettest@test-e2e.com",
                  "userType": "TRAINEE",
                  "companyId": "%s"
                }
                """, testCompanyId);

        MvcResult result = mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andReturn();

        UserDto createdUser = gson.fromJson(result.getResponse().getContentAsString(), UserDto.class);

        mockMvc.perform(get("/users/" + createdUser.id())
                        .cookie(new Cookie("access_token", adminAccessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdUser.id().toString()))
                .andExpect(jsonPath("$.forename").value("GetTest"))
                .andExpect(jsonPath("$.surname").value("User"))
                .andExpect(jsonPath("$.username").value("gettest@test-e2e.com"));
    }

    @Test
    void getUser_withInvalidId_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/users/invalid-uuid")
                        .cookie(new Cookie("access_token", adminAccessToken)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.property").value("id"));
    }

    @Test
    void getUser_withNonExistentId_shouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/users/00000000-0000-0000-0000-000000000000")
                        .cookie(new Cookie("access_token", adminAccessToken)))
                .andExpect(status().isNotFound());
    }

    @Test
    void getUser_withBlankId_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/users/ ")
                        .cookie(new Cookie("access_token", adminAccessToken)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getUser_withoutAuthentication_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/users/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getUserOptions_asAdmin_withValidParams_shouldReturnOptions() throws Exception {
        mockMvc.perform(get("/users/options")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .param("offset", "0")
                        .param("limit", "10")
                        .param("userType", "TRAINEE")
                        .param("company", testCompanyId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").exists())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void getUserOptions_withoutUserType_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/users/options")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .param("offset", "0")
                        .param("limit", "10")
                        .param("company", testCompanyId.toString()))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getUserOptions_withoutAccessToken_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/users/options")
                        .param("offset", "0")
                        .param("limit", "10")
                        .param("userType", "TRAINEE")
                        .param("company", testCompanyId.toString()))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteUser_withValidId_shouldReturnOk() throws Exception {
        // Create a user to delete
        String requestBody = String.format("""
                {
                  "forename": "ToDelete",
                  "surname": "User",
                  "email": "todelete@test-e2e.com",
                  "userType": "TRAINEE",
                  "companyId": "%s"
                }
                """, testCompanyId);

        MvcResult createResult = mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andReturn();

        UserDto userToDelete = gson.fromJson(createResult.getResponse().getContentAsString(), UserDto.class);

        mockMvc.perform(delete("/users/" + userToDelete.id())
                        .cookie(new Cookie("access_token", adminAccessToken)))
                .andExpect(status().isOk());

        // Verify user is deleted
        mockMvc.perform(get("/users/" + userToDelete.id())
                        .cookie(new Cookie("access_token", adminAccessToken)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteUser_withInvalidId_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(delete("/users/invalid-uuid")
                        .cookie(new Cookie("access_token", adminAccessToken)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.property").value("id"));
    }

    @Test
    void deleteUser_withNonExistentId_shouldReturnNotFound() throws Exception {
        mockMvc.perform(delete("/users/00000000-0000-0000-0000-000000000000")
                        .cookie(new Cookie("access_token", adminAccessToken)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.property").value("id"));
    }

    @Test
    void deleteUser_withBlankId_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(delete("/users/ ")
                        .cookie(new Cookie("access_token", adminAccessToken)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteUser_withoutAuthentication_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(delete("/users/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isForbidden());
    }

    @Test
    void createUser_duplicateEmail_shouldFail() throws Exception {
        // Create first user
        String firstUserBody = String.format("""
                {
                  "forename": "First",
                  "surname": "User",
                  "email": "duplicate@test-e2e.com",
                  "userType": "TRAINEE",
                  "companyId": "%s"
                }
                """, testCompanyId);

        mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(firstUserBody))
                .andExpect(status().isCreated());

        // Try to create second user with same email
        String duplicateUserBody = String.format("""
                {
                  "forename": "Duplicate",
                  "surname": "User",
                  "email": "duplicate@test-e2e.com",
                  "userType": "TRAINEE",
                  "companyId": "%s"
                }
                """, testCompanyId);

        mockMvc.perform(post("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(duplicateUserBody))
                .andExpect(status().isConflict());
    }

    @Test
    void getUsers_withCustomPagination_shouldRespectParams() throws Exception {
        mockMvc.perform(get("/users")
                        .cookie(new Cookie("access_token", adminAccessToken))
                        .param("offset", "5")
                        .param("limit", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.offset").value(5))
                .andExpect(jsonPath("$.limit").value(3));
    }
}


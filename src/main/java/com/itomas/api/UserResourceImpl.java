package com.itomas.api;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2RestOperations;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itomas.oauth2.google.security.model.GoogleProfile;

@Component
@RequestMapping("profile")
public class UserResourceImpl implements UserResource {
    private static Logger LOGGER = LoggerFactory.getLogger(UserResourceImpl.class);
    private static ObjectMapper OM = new ObjectMapper();

    
    @Autowired private OAuth2RestOperations oauth2RestTemplate;


    /* (non-Javadoc)
	 * @see com.itomas.api.UserResourceI#retrieveProfile(org.springframework.security.oauth2.provider.OAuth2Authentication)
	 */
    @Override
	@RequestMapping(method = RequestMethod.GET)
    public @ResponseBody GoogleProfile retrieveProfile(OAuth2Authentication principal) throws JsonProcessingException {

    	OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) principal.getDetails();
    	LOGGER.info(principal.getName());
    	LOGGER.info(principal.getAuthorities()+"");
        GoogleProfile profile = getGoogleProfile();
        return profile;
    }
    private GoogleProfile getGoogleProfile() {
        String url = "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + oauth2RestTemplate.getAccessToken();
//        String url = "https://www.googleapis.com/userinfo/v2/me?key="+oauth2RestTemplate.getAccessToken();
        ResponseEntity<GoogleProfile> forEntity = oauth2RestTemplate.getForEntity(url, GoogleProfile.class);
        return forEntity.getBody();
    }
}

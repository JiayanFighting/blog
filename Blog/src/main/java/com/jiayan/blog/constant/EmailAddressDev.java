package com.jiayan.blog.constant;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EmailAddressDev implements InitializingBean {
    @Value("${com.microsoft.statusly.emailAddressDev}")
    private String emailAddressDev;

    public static String EMAIL_ADDRESS_DEV;

    @Override
    public void afterPropertiesSet() throws Exception {
        EMAIL_ADDRESS_DEV = emailAddressDev;
    }
}

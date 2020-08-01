// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

package com.jiayan.blog.aad;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Endpoint where errors will be redirected
 */
@CrossOrigin
@Controller
public class ErrorHandlerController implements ErrorController {

    private static final String PATH = "/error";

    @RequestMapping(value = PATH)
    public ModelAndView returnErrorPage(HttpServletRequest req, HttpServletResponse response) {
        ModelAndView mav = new ModelAndView("error");
        mav.addObject("error", req.getAttribute("error"));
        return  mav;
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }
}

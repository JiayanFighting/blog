package com.jiayan.blog.controller;

import com.jiayan.blog.domain.UserDO;
import com.jiayan.blog.service.UserService;
import com.jiayan.blog.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/whitelist")
public class WhitelistController {

    @Autowired
    UserService userService;

    @Autowired
    UserController userController;

    @RequestMapping("/list")
    public Result getWhitelist(){
        String email = userController.getLoginUser();
        log.info("/whitelist/list:email="+email);
        if (userService.findByEmail(email).getType() == UserDO.USER_TYPE_ADMIN){
            Result res = new Result();
            List<UserDO> list = userService.getAllWhitelist();
            res.put("list",list);
            return res;
        }else {
            return Result.error("No permission");
        }
    }

    @PostMapping("/add")
    public Result addWhitelistUser(@RequestBody Map<String,String> params) {
        String email =  params.get("email");
        log.info("/whitelist/add:email="+email);
        if (email== null || email.length() == 0){
            return Result.error("Parameter error");
        }
        if (userService.findByEmail(userController.getLoginUser()).getType() == UserDO.USER_TYPE_ADMIN) {
            if (userService.addWhitelist(email) > 0){
                return Result.ok();
            }
            return Result.error("Do not add again!");
        }else {
            return Result.error("No permission");
        }
    }

    @PostMapping("/delete")
    public Result deleteWhitelistUser(@RequestBody Map<String,String> params) {
        String email =  params.get("email");
        log.info("/whitelist/delete:email="+email);
        String loggedUser =userController.getLoginUser();
        // only the admin can delete users from the whitelist and the super admin can delete the normal admin
        if (userService.findByEmail(loggedUser).getType() == UserDO.USER_TYPE_ADMIN){
            UserDO deleteUser = userService.findByEmail(email);
            if (userService.isSuperAdmin(loggedUser) || deleteUser == null || deleteUser.getType() == UserDO.USER_STATUS_NORMAL){
                userService.deleteWhitelist(email);
                return Result.ok();
            }
        }
        return Result.error("No permission");
    }

    @PostMapping("/setAdmin")
    public Result setAdmin(@RequestBody Map<String,String> params) {
        String email =  params.get("email");
        log.info("/whitelist/setAdmin:email="+email);
        if (userService.isSuperAdmin(userController.getLoginUser())) {
            if (userService.setAdmin(email) > 0){
                return Result.ok();
            }
            return Result.error("Has been set or the user has not logged in");
        }else {
            return Result.error("No permission");
        }
    }

    @PostMapping("/cancelAdmin")
    public Result cancelAdmin(@RequestBody Map<String,String> params) {
        String email =  params.get("email");
        log.info("/whitelist/cancelAdmin:email="+email);
        if (userService.isSuperAdmin(userController.getLoginUser())) {
            if (userService.cancelAdmin(email) > 0){
                return Result.ok();
            }
            return Result.error("Has been set or the user has not logged in");
        }else {
            return Result.error("No permission");
        }
    }
}

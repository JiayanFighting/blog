package com.jiayan.blog.domain;


import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamDO {
    private int id;
    private String teamName;
    private String teamEmail;
    private String teamDesc;
    private String leadEmail;
    private String ccList;
    private String createTime;
    private String updateTime;
    private int statusCode;
}

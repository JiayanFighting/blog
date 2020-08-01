package com.jiayan.blog.domain;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoDO {
    private String email;
    private String path;
    private int teamId;
}

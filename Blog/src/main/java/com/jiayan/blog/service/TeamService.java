package com.jiayan.blog.service;

import com.jiayan.blog.domain.TeamDO;
import com.jiayan.blog.domain.UserDO;

import java.util.List;

public interface TeamService {
    TeamDO getTeamInfo(int id);

    int create(TeamDO team);

    int update(TeamDO team);

    int delete(int id);

    List<TeamDO> getCreatedTeamList(String leadEmail);

    List<TeamDO> getJoinedTeamList(String userEmail);

    List<TeamDO> search(String content);

    List<UserDO> getTeamMembers(int teamId);

    List<TeamDO> searchNotJoined(String content, String userEmail);
}

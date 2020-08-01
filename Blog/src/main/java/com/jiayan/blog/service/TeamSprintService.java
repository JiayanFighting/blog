package com.jiayan.blog.service;

import com.jiayan.blog.domain.TeamSprintDO;

import java.util.List;

public interface TeamSprintService {

    int create(TeamSprintDO teamSprintDO);

    int delete(int id);

    int update(TeamSprintDO teamSprintDO);

    List<TeamSprintDO> list(int teamId);

    List<TeamSprintDO> getCurrentSprints(int teamId, String curTime);

    TeamSprintDO getSprintUnique(int teamId, int sprint, String type);
}

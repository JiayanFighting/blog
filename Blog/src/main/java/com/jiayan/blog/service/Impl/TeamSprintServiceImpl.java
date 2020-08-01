package com.jiayan.blog.service.Impl;

import com.jiayan.blog.dao.TeamSprintMapper;
import com.jiayan.blog.domain.TeamSprintDO;
import com.jiayan.blog.service.TeamSprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamSprintServiceImpl implements TeamSprintService {
    @Autowired
    TeamSprintMapper teamSprintMapper;


    @Override
    public int create(TeamSprintDO teamSprintDO) {
        int res = teamSprintMapper.create(teamSprintDO);
        if (res > 0) {
            return teamSprintDO.getId();
        }
        // if exist, check the status_code
        if (teamSprintDO.getTeamId() > 0 && teamSprintDO.getSprint() > 0 && teamSprintDO.getType() != null ){
            TeamSprintDO teamSprint = teamSprintMapper.getSprintUnique(
                    teamSprintDO.getTeamId(),teamSprintDO.getSprint(),teamSprintDO.getType());
            if (teamSprint.getStatusCode() == 0) {
                return -1;
            }
            teamSprintDO.setId(teamSprint.getId());
            teamSprintDO.setStatusCode(0);
            teamSprintMapper.update(teamSprintDO);
            return teamSprint.getId();
        }
        return 0;
    }

    @Override
    public int delete(int id) {
        return teamSprintMapper.delete(id);
    }

    @Override
    public int update(TeamSprintDO teamSprintDO) {
        return teamSprintMapper.update(teamSprintDO);
    }

    @Override
    public List<TeamSprintDO> list(int teamId) {
        return teamSprintMapper.list(teamId);
    }

    @Override
    public List<TeamSprintDO> getCurrentSprints(int teamId, String curTime) {
        return teamSprintMapper.getCurrentSprints(teamId,curTime);
    }

    @Override
    public TeamSprintDO getSprintUnique(int teamId, int sprint, String type) {
        return teamSprintMapper.getSprintUnique(teamId,sprint,type);
    }
}

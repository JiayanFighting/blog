package com.jiayan.blog.service.Impl;

import com.jiayan.blog.dao.TeamMapper;
import com.jiayan.blog.dao.TeamRelationshipMapper;
import com.jiayan.blog.dao.UserMapper;
import com.jiayan.blog.domain.TeamDO;
import com.jiayan.blog.domain.UserDO;
import com.jiayan.blog.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamServiceImpl implements TeamService {

    @Autowired
    TeamMapper teamMapper;

    @Autowired
    TeamRelationshipMapper teamRelationshipMapper;

    @Autowired
    UserMapper userMapper;

    @Override
    public TeamDO getTeamInfo(int id) {
        return teamMapper.getTeamInfo(id);
    }

    @Override
    public int create(TeamDO team) {
        return teamMapper.create(team);
    }

    @Override
    public int update(TeamDO team) {
        return teamMapper.update(team);
    }

    @Override
    @Transactional(rollbackFor = {RuntimeException.class, Error.class})
    public int delete(int id) {
        if (teamMapper.delete(id) > 0) {
            // delete team_relationship
            teamRelationshipMapper.deleteAll(id);
            // delete sprint
            // delete template
            return 1;
        }
        return 0;
    }

    @Override
    public List<TeamDO> getCreatedTeamList(String leadEmail) {
        return teamMapper.getCreatedTeamList(leadEmail);
    }

    @Override
    public  List<TeamDO> getJoinedTeamList(String userEmail) {
        return teamMapper.getJoinedTeamList(userEmail);
    }

    @Override
    public List<TeamDO> search(String content) {
        return teamMapper.search(content);
    }

    @Override
    public List<UserDO> getTeamMembers(int teamId) {
        return teamRelationshipMapper.getTeamMembers(teamId);
    }

    @Override
    public List<TeamDO> searchNotJoined(String content, String userEmail) {
        return teamMapper.searchNotJoined(content,userEmail);
    }

}

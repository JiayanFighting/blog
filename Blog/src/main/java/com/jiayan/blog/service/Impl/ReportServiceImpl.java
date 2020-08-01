package com.jiayan.blog.service.Impl;

import com.jiayan.blog.dao.ReportMapper;

import com.jiayan.blog.domain.ReportDO;
import com.jiayan.blog.domain.TeamDO;
import com.jiayan.blog.domain.UserDO;
import com.jiayan.blog.service.ReportService;
import com.jiayan.blog.service.TeamService;
import com.jiayan.blog.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReportServiceImpl implements ReportService {
    @Autowired
    private ReportMapper reportMapper;
    @Autowired
    private TeamService teamService;

    @Override
    public void submit(ReportDO report) {

    }

    @Override
    public List<ReportVO> list(Map<String, Object> map) {
        return reportMapper.list(map);
    }

    @Override
    public int save(ReportDO report) {
        return reportMapper.save(report);
    }

    @Override
    public List<UserDO> peopleToRemind(Map<String, Object> params, List<TeamDO> createdList) {
        List<UserDO> res = new ArrayList<>();

        List<UserDO> users = new ArrayList<>();

        List<ReportVO> reportDOS = list(params);
        Set<String> reportSet = new HashSet<>();
        for (ReportVO report : reportDOS) {
            reportSet.add(report.getFromEmail());
        }

        for (TeamDO team : createdList) {
            users.addAll(teamService.getTeamMembers(team.getId()));
        }

        Set<String> resDeDup = new HashSet<>();
        for (UserDO cur : users) {
            String curEmail = cur.getEmail();
            if (!reportSet.contains(curEmail)) {
                if (resDeDup.add(curEmail)) {
                    res.add(cur);
                }
            }
        }

        return res;
    }

    @Override
    public ReportVO getReportById(int id) {
        return reportMapper.getReportById(id);
    }

    @Override
    public int update(ReportDO report) {
        return reportMapper.update(report);
    }

    @Override
    public ReportDO getReportDetail(Map<String, Object> map) {
        return reportMapper.getReportDetail(map);
    }


}

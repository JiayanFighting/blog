package com.jiayan.blog.service;

import com.jiayan.blog.domain.ReportDO;
import com.jiayan.blog.domain.TeamDO;
import com.jiayan.blog.domain.UserDO;
import com.jiayan.blog.vo.ReportVO;

import java.util.List;
import java.util.Map;

public interface ReportService {
    void submit(ReportDO report);

    List<ReportVO> list(Map<String, Object> map);

    int save(ReportDO report);

    List<UserDO> peopleToRemind(Map<String, Object> params, List<TeamDO> createdList);

    ReportVO getReportById(int id);

    int update(ReportDO report);

    ReportDO getReportDetail(Map<String, Object> map);
}

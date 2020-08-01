package com.jiayan.blog.service;

import com.jiayan.blog.domain.TemplateDO;

import java.util.List;

public interface TemplateService {
    List<TemplateDO> getTemplatesInTeam(int teamId);

    int createTemplate(TemplateDO templateDO);

    TemplateDO findById(int id);

    List<TemplateDO> findByType(int teamId,String type);

    List<TemplateDO> getAllTemplates();

    int updateTemplate(TemplateDO templateDO);

    int deleteTemplate(int id);
}

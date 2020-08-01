package com.jiayan.blog.service.Impl;

import com.jiayan.blog.dao.TemplateMapper;
import com.jiayan.blog.domain.TemplateDO;
import com.jiayan.blog.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemplateServiceImpl implements TemplateService {
    @Autowired
    private TemplateMapper templateMapper;

    @Override
    public List<TemplateDO> getTemplatesInTeam(int teamId) {
        return templateMapper.getTemplatesByTeamId(teamId);
    }

    @Override
    public int createTemplate(TemplateDO templateDO) {
        return templateMapper.save(templateDO);
    }

    @Override
    public TemplateDO findById(int id) {
        return templateMapper.findById(id);
    }

    @Override
    public List<TemplateDO> findByType(int teamId,String type) {
        return templateMapper.findByType(teamId,type);
    }

    @Override
    public List<TemplateDO> getAllTemplates() {
        return templateMapper.getAllTemplates();
    }

    @Override
    public int updateTemplate(TemplateDO templateDO) {
        return templateMapper.update(templateDO);
    }

    @Override
    public int deleteTemplate(int id) {
        return templateMapper.delete(id);
    }
}

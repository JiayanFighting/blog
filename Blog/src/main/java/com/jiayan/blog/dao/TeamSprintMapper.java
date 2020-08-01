package com.jiayan.blog.dao;

import com.jiayan.blog.domain.TeamSprintDO;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Mapper
public interface TeamSprintMapper {

    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    @Insert("insert ignore into team_sprint (`team_id`, `type`, `sprint`, `begin_time`, `end_time`)"
            + "values (#{teamId}, #{type}, #{sprint}, #{beginTime}, #{endTime})")
    int create(TeamSprintDO teamSprintDO);

    @Update("update team_sprint set status_code = 1 where id = #{id}")
    int delete(int id);

    @Update("<script>"+
            "update team_sprint " +
            "<set>" +
            "<if test=\"sprint != null and sprint > 0 \">`sprint` = #{sprint}, </if>" +
            "<if test=\"beginTime != null\">`begin_time` = #{beginTime}, </if>" +
            "<if test=\"endTime != null\">`end_time` = #{endTime}, </if>" +
            "<if test=\"statusCode != null\">`status_code` = #{statusCode}, </if>" +
            "</set>" +
            "where `id` = #{id}" +
            "</script>")
    int update(TeamSprintDO teamSprintDO);

    @Select("select `id`,`team_id`, `type`, `sprint`, `begin_time`, `end_time`,`status_code` " +
            " from team_sprint " +
            " where team_id = #{teamId} and status_code = 0 ")
    @Results(id="teamSprintMap", value={
            @Result(column="team_id", property="teamId"),
            @Result(column="begin_time", property="beginTime"),
            @Result(column="end_time", property="endTime"),
            @Result(column="status_code", property="statusCode")
    })
    List<TeamSprintDO> list(@Param("teamId") int teamId);

    @Select("select `id`,`team_id`, `type`, `sprint`, `begin_time`, `end_time`,`status_code` " +
            " from team_sprint " +
            " where team_id = #{teamId} and status_code = 0 " +
            " and begin_time <= #{curTime} " +
            " and end_time >= #{curTime} ")
    @ResultMap("teamSprintMap")
    List<TeamSprintDO> getCurrentSprints(@Param("teamId") int teamId, @Param("curTime") String curTime);

    @Select("select `id`,`team_id`, `type`, `sprint`, `begin_time`, `end_time`,`status_code` " +
            " from team_sprint " +
            " where team_id = #{teamId} and sprint = #{sprint} and type = #{type} ")
    @ResultMap("teamSprintMap")
    TeamSprintDO getSprintUnique(@Param("teamId") int teamId,@Param("sprint") int sprint,@Param("type") String type);
}



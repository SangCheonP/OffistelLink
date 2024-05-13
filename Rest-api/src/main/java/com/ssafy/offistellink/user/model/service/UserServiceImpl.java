package com.ssafy.offistellink.user.model.service;

import com.ssafy.offistellink.user.model.dto.UserDto;
import com.ssafy.offistellink.user.model.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<UserDto> getAllUsers() throws SQLException{
        return userMapper.selectAll();
    }
}
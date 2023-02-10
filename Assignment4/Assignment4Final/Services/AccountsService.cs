﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Assignment4Final.Data.Repositories;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using ModelLibrary.Models.DTO.Accounts;

namespace Assignment4Final.Services;

public class AccountsService
{
    private readonly IAccountsRepository _repository;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AccountsService(
        IAccountsRepository repository,
        IMapper mapper,
        IConfiguration configuration
    )
    {
        _repository = repository;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<List<UserDto>> GetListUsers()
    {
        return _mapper.Map<List<UserDto>>(await _repository.ListUsers());
    }

    public async Task MakeAdmin(string email)
    {
        await _repository.MakeAdmin(email);
    }

    public async Task RemoveAdmin(string email)
    {
        await _repository.RemoveAdmin(email);
    }

    public async Task MakeMarker(string email)
    {
        await _repository.MakeMarker(email);
    }

    public async Task RemoveMarker(string email)
    {
        await _repository.RemoveMarker(email);
    }

    public async Task MakeQualityControl(string email)
    {
        await _repository.MakeQualityControl(email);
    }

    public async Task RemoveQualityControl(string email)
    {
        await _repository.RemoveQualityControl(email);
    }

    public async Task MakeCandidate(string email)
    {
        await _repository.MakeCandidate(email);
    }

    public async Task RemoveCandidate(string email)
    {
        await _repository.RemoveCandidate(email);
    }

    public async Task<AuthenticationResponseDto> Create(LoginDto userCredentials)
    {
        var createResult = await _repository.Create(
            userCredentials.Email,
            userCredentials.Password
        );
        if (createResult.Succeeded)
        {
            if (userCredentials.IsCandidate != null && userCredentials.IsCandidate == true)
            {
                await MakeCandidate(userCredentials.Email);
            }

            return await BuildToken(userCredentials);
        }

        return new AuthenticationResponseDto { Errors = createResult.Errors };
    }

    public async Task<AuthenticationResponseDto?> Login(LoginDto userCredentials)
    {
        var loginResult = await _repository.Login(userCredentials.Email, userCredentials.Password);
        if (loginResult.Succeeded)
        {
            return await BuildToken(userCredentials);
        }
        return null;
    }

    private async Task<AuthenticationResponseDto> BuildToken(LoginDto userCredentials)
    {
        var user = await _repository.GetAppUser(userCredentials.Email);

        var claims = new List<Claim>()
        {
            new Claim("email", userCredentials.Email),
            new Claim("userId", user.Id)
        };

        var claimsDB = await _repository.GetClaims(user);

        claims.AddRange(claimsDB);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["keyjwt"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiration = DateTime.UtcNow.AddYears(1);

        var token = new JwtSecurityToken(
            issuer: null,
            audience: null,
            claims: claims,
            expires: expiration,
            signingCredentials: creds
        );

        return new AuthenticationResponseDto()
        {
            Email = user.Email,
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expiration = expiration
        };
    }
}

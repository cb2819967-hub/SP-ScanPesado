package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Region;
import com.scanpesado.backend.repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegionService {

    @Autowired
    private RegionRepository regionRepository;

    public List<Region> getAllRegiones() {
        return regionRepository.findAll();
    }
}

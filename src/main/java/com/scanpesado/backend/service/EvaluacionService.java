package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Evaluacion;
import com.scanpesado.backend.repository.EvaluacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class EvaluacionService {

    @Autowired
    private EvaluacionRepository evaluacionRepository;

    public Evaluacion createEvaluacion(Long idVerificacion, Long idTecnico) {
        Evaluacion eval = new Evaluacion();
        eval.setIdVerificacion(idVerificacion);
        eval.setIdTecnico(idTecnico);
        return evaluacionRepository.save(eval);
    }

    public Optional<Evaluacion> updateEvaluacion(Long id, Evaluacion newData) {
        return evaluacionRepository.findById(id).map(eval -> {
            if (newData.getLucesAltas() != null) eval.setLucesAltas(newData.getLucesAltas());
            if (newData.getPresionIzqDel() != null) eval.setPresionIzqDel(newData.getPresionIzqDel());
            if (newData.getComentarios() != null) eval.setComentarios(newData.getComentarios());
            return evaluacionRepository.save(eval);
        });
    }
}

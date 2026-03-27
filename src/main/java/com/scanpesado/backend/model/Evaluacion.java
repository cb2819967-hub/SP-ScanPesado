package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "evaluaciones")
public class Evaluacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion")
    private Long id;

    @Column(name = "id_verificacion")
    private Long idVerificacion;

    @Column(name = "id_tecnico")
    private Long idTecnico;

    @Column(columnDefinition = "TEXT")
    private String comentarios;

    @Column(name = "fecha_captura")
    private LocalDateTime fechaCaptura = LocalDateTime.now();

    @Column(name = "luces_galibo")
    private String lucesGalibo;

    @Column(name = "luces_altas")
    private String lucesAltas;

    @Column(name = "luces_bajas")
    private String lucesBajas;

    @Column(name = "luces_demarcadoras_delanteras")
    private String lucesDemarcadorasDelanteras;

    @Column(name = "luces_demarcadoras_traseras")
    private String lucesDemarcadorasTraseras;

    @Column(name = "luces_indicadoras")
    private String lucesIndicadoras;

    @Column(name = "faro_izquierdo")
    private String faroIzquierdo;

    @Column(name = "faro_derecho")
    private String faroDerecho;

    @Column(name = "luces_direccionales_delanteras")
    private String lucesDireccionalesDelanteras;

    @Column(name = "luces_direccionales_traseras")
    private String lucesDireccionalesTraseras;

    @Column(name = "llantas_rines_delanteros")
    private String llantasRinesDelanteros;

    @Column(name = "llantas_rines_traseros")
    private String llantasRinesTraseros;

    @Column(name = "llantas_masas_delanteras")
    private String llantasMasasDelanteras;

    @Column(name = "llantas_masas_traseras")
    private String llantasMasasTraseras;

    @Column(name = "llantas_presion_delantera_izquierda")
    private Double llantasPresionDelanteraIzquierda;

    @Column(name = "llantas_presion_delantera_derecha")
    private Double llantasPresionDelanteraDerecha;

    @Column(name = "presion_izq_del")
    private Integer presionIzqDel;

    @Column(name = "llantas_presion_trasera_izquierda_1")
    private Double llantasPresionTraseraIzquierda1;

    @Column(name = "llantas_presion_trasera_izquierda_2")
    private Double llantasPresionTraseraIzquierda2;

    @Column(name = "llantas_presion_trasera_derecha_1")
    private Double llantasPresionTraseraDerecha1;

    @Column(name = "llantas_presion_trasera_derecha_2")
    private Double llantasPresionTraseraDerecha2;

    @Column(name = "llantas_profundidad_delantera_izquierda")
    private Double llantasProfundidadDelanteraIzquierda;

    @Column(name = "llantas_profundidad_delantera_derecha")
    private Double llantasProfundidadDelanteraDerecha;

    @Column(name = "llantas_profundidad_trasera_izquierda_1")
    private Double llantasProfundidadTraseraIzquierda1;

    @Column(name = "llantas_profundidad_trasera_izquierda_2")
    private Double llantasProfundidadTraseraIzquierda2;

    @Column(name = "llantas_profundidad_trasera_derecha_1")
    private Double llantasProfundidadTraseraDerecha1;

    @Column(name = "llantas_profundidad_trasera_derecha_2")
    private Double llantasProfundidadTraseraDerecha2;

    @Column(name = "llantas_birlos_delantera_izquierda")
    private String llantasBirlosDelanteraIzquierda;

    @Column(name = "llantas_birlos_delantera_derecha")
    private String llantasBirlosDelanteraDerecha;

    @Column(name = "llantas_birlos_trasera_izquierda")
    private String llantasBirlosTraseraIzquierda;

    @Column(name = "llantas_birlos_trasera_derecha")
    private String llantasBirlosTraseraDerecha;

    @Column(name = "llantas_birlos_delantera_izquierda_num")
    private Integer llantasBirlosDelanteraIzquierdaNum = 0;

    @Column(name = "llantas_birlos_delantera_derecha_num")
    private Integer llantasBirlosDelanteraDerechaNum = 0;

    @Column(name = "llantas_birlos_trasera_izquierda_num")
    private Integer llantasBirlosTraseraIzquierdaNum = 0;

    @Column(name = "llantas_birlos_trasera_derecha_num")
    private Integer llantasBirlosTraseraDerechaNum = 0;

    @Column(name = "llantas_tuercas_delantera_izquierda")
    private String llantasTuercasDelanteraIzquierda;

    @Column(name = "llantas_tuercas_delantera_derecha")
    private String llantasTuercasDelanteraDerecha;

    @Column(name = "llantas_tuercas_trasera_izquierda")
    private String llantasTuercasTraseraIzquierda;

    @Column(name = "llantas_tuercas_trasera_derecha")
    private String llantasTuercasTraseraDerecha;

    @Column(name = "llantas_tuercas_delantera_izquierda_num")
    private Integer llantasTuercasDelanteraIzquierdaNum = 0;

    @Column(name = "llantas_tuercas_delantera_derecha_num")
    private Integer llantasTuercasDelanteraDerechaNum = 0;

    @Column(name = "llantas_tuercas_trasera_izquierda_num")
    private Integer llantasTuercasTraseraIzquierdaNum = 0;

    @Column(name = "llantas_tuercas_trasera_derecha_num")
    private Integer llantasTuercasTraseraDerechaNum = 0;

    @Column(name = "brazo_pitman")
    private String brazoPitman;

    @Column(name = "manijas_de_puertas")
    private String manijasDePuertas;

    @Column(name = "chavetas")
    private String chavetas;

    @Column(name = "chavetas_num")
    private Integer chavetasNum = 0;

    @Column(name = "compresor")
    private String compresor;

    @Column(name = "tanques_de_aire")
    private String tanquesDeAire;

    @Column(name = "tiempo_de_carga_psi")
    private Double tiempoDeCargaPsi;

    @Column(name = "tiempo_de_carga_tiempo")
    private Double tiempoDeCargaTiempo;

    @Column(name = "humo")
    private String humo;

    @Column(name = "gobernado")
    private String gobernado;

    @Column(name = "caja_direccion")
    private String cajaDireccion;

    @Column(name = "deposito_aceite")
    private String depositoAceite;

    @Column(name = "parabrisas")
    private String parabrisas;

    @Column(name = "limpiaparabrisas")
    private String limpiaparabrisas;

    @Column(name = "huelgo")
    private String huelgo;

    @Column(name = "huelgo_cuanto")
    private Double huelgoCuanto;

    @Column(name = "escape")
    private String escape;

    @Lob
    @Column(name = "evidencia1", columnDefinition = "LONGTEXT")
    private String evidencia1;

    @Lob
    @Column(name = "evidencia2", columnDefinition = "LONGTEXT")
    private String evidencia2;

    @Lob
    @Column(name = "evidencia3", columnDefinition = "LONGTEXT")
    private String evidencia3;

    @Lob
    @Column(name = "evidencia4", columnDefinition = "LONGTEXT")
    private String evidencia4;

    @Lob
    @Column(name = "evidencia5", columnDefinition = "LONGTEXT")
    private String evidencia5;

    @Column(columnDefinition = "TEXT")
    private String comentariosTecnico;

    private Boolean activo = true;
}

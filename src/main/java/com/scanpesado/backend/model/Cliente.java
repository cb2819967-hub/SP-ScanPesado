package com.scanpesado.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long id;

    @Column(name = "razon_social", nullable = false, length = 150)
    private String razonSocial;

    @Column(name = "rfc", length = 20)
    private String rfc;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "telefono_alternativo", length = 20)
    private String telefonoAlternativo;

    @Column(name = "gestor", length = 100)
    private String gestor;

    @Column(name = "activo")
    private Boolean activo = true;

    // --- GETTERS Y SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRazonSocial() { return razonSocial; }
    public void setRazonSocial(String razonSocial) { this.razonSocial = razonSocial; }

    public String getRfc() { return rfc; }
    public void setRfc(String rfc) { this.rfc = rfc; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getTelefonoAlternativo() { return telefonoAlternativo; }
    public void setTelefonoAlternativo(String telefonoAlternativo) { this.telefonoAlternativo = telefonoAlternativo; }

    public String getGestor() { return gestor; }
    public void setGestor(String gestor) { this.gestor = gestor; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
select * from Empresas

select * from Sucursales

select * from EQUIPOS_POR_SUCURSAL

select *
-- update s set s.id_empresa ='EMP-001'
from Sucursales s where s.id_sucursal='SUC-002'


INSERT INTO EQUIPOS_POR_SUCURSAL(Id_equipo,id_sucurusal, nombre, status_del_registro)
select NEWID() as Id_equipo , 'SUC-002'   AS id_sucurusal, nombre, status_del_registro
from EQUIPOS_POR_SUCURSAL


select * from Perfiles
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpleoEntity } from './empleo.entity';
import { EmpleoRepository } from './empleo.repository';
import { EmpleoDTO } from './dto/empleo.dto';

@Injectable()
export class EmpleoService {

    constructor(
        @InjectRepository(EmpleoEntity)
        private empleoRepository: EmpleoRepository
    ) { }

    async getAll(): Promise<EmpleoEntity[]> {
        const listaEmpleos = await this.empleoRepository.find();
        if (!listaEmpleos.length) {
            throw new NotFoundException({ message: 'Lista de empleos vacia' })
        }
        return listaEmpleos;
    }

    async findById(id: number): Promise<EmpleoEntity> {
        const empleo = await this.empleoRepository.findOne({ where: { id: id } })
        if (!empleo) {
            throw new NotFoundException({ message: 'No existe el empleo' })
        }
        return empleo;
    }

    async create(dto: EmpleoDTO): Promise<any> {
        const empleo = this.empleoRepository.create(dto);
        await this.empleoRepository.save(empleo)
        return { message:`El empleo ${empleo.titulo} ha sido creado con exito`}
    }

    
    async update(id: number,dto: EmpleoDTO): Promise<any> {
        const empleo = await this.findById(id);
        if (!empleo) {
            throw new NotFoundException({ message: 'No existe el empleo' })
        }
        
        dto.titulo? empleo.titulo = dto.titulo : empleo.titulo = empleo.titulo;
        dto.descripcion? empleo.descripcion = dto.descripcion : empleo.descripcion = empleo.descripcion;
        dto.empresa? empleo.empresa = dto.empresa : empleo.empresa = empleo.empresa;
        dto.createdAt? empleo.createdAt = dto.createdAt : empleo.createdAt = empleo.createdAt;
        dto.tipoContrato? empleo.tipoContrato = dto.tipoContrato : empleo.tipoContrato = empleo.tipoContrato;
        dto.jornada? empleo.jornada = dto.jornada : empleo.jornada = empleo.jornada;
        dto.salario? empleo.salario = dto.salario : empleo.salario = empleo.salario;
        dto.logo? empleo.logo = dto.logo : empleo.logo = empleo.logo;

        await this.empleoRepository.save(empleo)
        return { message:`El empleo ${empleo} ha sido actualizado con exito`}
    }

    async delete(id: number): Promise<any> {
        const empleo = await this.empleoRepository.delete(id);
        return { message:`El empleo ${empleo} ha sido eliminado con exito`}
    }

}

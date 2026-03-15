const Appointment = require('../models/Appointment');
const User = require('../models/User');
const weatherService = require('../utils/weatherService');

// 1. Criar Agendamento
exports.create = async (req, res) => {
  try {
    const { date, notes } = req.body;
    const patientId = req.userId;

    const appointmentDate = new Date(date);
    const endDate = new Date(appointmentDate.getTime() + 60 * 60 * 1000);

    const user = await User.findById(patientId);
    if (!user || !user.address?.city) {
      return res.status(400).json({ message: 'Perfil do paciente incompleto (Cidade não informada).' });
    }

    const conflicting = await Appointment.findOne({
      status: 'scheduled',
      date: { $lt: endDate, $gte: appointmentDate }
    });

    if (conflicting) {
      return res.status(400).json({ message: 'Este horário já está ocupado por outro paciente.' });
    }

    let weatherData = { condition: 'Previsão indisponível', willRain: false };
    const diffDays = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    
    if (diffDays >= 0 && diffDays <= 5) {
      weatherData = await weatherService.getWeatherForecast(user.address.city, date);
    }

    const appointment = new Appointment({
      patientId,
      date: appointmentDate,
      notes,
      weatherForecast: weatherData
    });

    await appointment.save();

    res.status(201).json({
      message: 'Consulta agendada!',
      alert: weatherData.willRain ? '⚠️ Atenção: Há previsão de chuva!' : null,
      appointment
    });

  } catch (error) {
    console.error('Erro ao agendar:', error);
    res.status(500).json({ message: 'Erro interno ao processar agendamento.' });
  }
};

// 2. Listar Agendamentos
exports.list = async (req, res) => {
  try {
    let query = {};
    if (req.userRole === 'patient') {
      query.patientId = req.userId;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
  }
};

// 3. Cancelar Agendamento
exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    if (req.userRole === 'patient' && appointment.patientId.toString() !== req.userId) {
      return res.status(401).json({ message: 'Não autorizado.' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Agendamento cancelado com sucesso!', appointment });
  } catch (error) {
    console.error('Erro ao cancelar:', error);
    res.status(500).json({ message: 'Erro ao cancelar agendamento.' });
  }
};
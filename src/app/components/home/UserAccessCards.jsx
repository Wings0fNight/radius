import React from 'react';
import { useState } from 'react';

const UserAccess = () => {
	const [text, setText] = useState('')
	const [select, setSelect] = useState('All')
    const accessCitys = [																				//FIXME: ПЕРЕДЕЛАТЬ НА ФУНКЦИЮ РАЗБОРА ДАННЫХ ПОСЛЕ ИХ ПОЛУЧЕНИЯ
		{ id: 1, group: "TEST DATA", city: "TEST DATA", layer: "TEST DATA", access: "TEST DATA"},
		{ id: 2, group: "Индивидуальные", city: "Санкт-Петербург", layer: "AGGREGATE", access: "RW"},
		{ id: 3, group: "Групповые", city: "Новосибирск", layer: "ACCESS", access: "RO"},
		{ id: 4, group: "Групповые", city: "Екатеринбург", layer: "CORE", access: "RW"},
		{ id: 5, group: "Индивидуальные", city: "Казань", layer: "CORE", access: "RO"},
		{ id: 6, group: "Групповые", city: "Самара", layer: "AGGREGATE", access: "RO"},
		{ id: 7, group: "Индивидуальные", city: "Челябинск", layer: "ACCESS", access: "RW"},
		{ id: 8, group: "Групповые", city: "Омск", layer: "CORE", access: "RO"},
		{ id: 9, group: "Групповые", city: "Красноярск", layer: "AGGREGATE", access: "RW"},
		{ id: 10, group: "Индивидуальные", city: "Пермь", layer: "ACCESS", access: "RO"},
		{ id: 11, group: "Групповые", city: "Нижний Новгород", layer: "CORE", access: "RW"},
		{ id: 12, group: "Индивидуальные", city: "Воронеж", layer: "AGGREGATE", access: "RO"},
		{ id: 13, group: "Групповые", city: "Саратов", layer: "ACCESS", access: "RW"},
		{ id: 14, group: "Групповые", city: "Уфа", layer: "CORE", access: "RO"},
		{ id: 15, group: "Индивидуальные", city: "Краснодар", layer: "AGGREGATE", access: "RW"},
		{ id: 16, group: "Групповые", city: "Волгоград", layer: "ACCESS", access: "RO"},
		{ id: 17, group: "Групповые", city: "Тюмень", layer: "CORE", access: "RW"},
		{ id: 18, group: "Индивидуальные", city: "Кемерово", layer: "AGGREGATE", access: "RO"},
		{ id: 19, group: "Групповые", city: "Ижевск", layer: "ACCESS", access: "RW"},
		{ id: 20, group: "Групповые", city: "Барнаул", layer: "CORE", access: "RO"},
    ];
	const filter = accessCitys.filter(accessCity => 
		accessCity.city.toLowerCase().includes(text.toLowerCase())
	  )
	const filteredGroupAccess = accessCitys.filter(p => p.group === select)

    return (
        <div className='w-[93%] m-10 h-[70%] max-h-[90%] p-6 bg-card border border-border rounded-lg shadow-md'>
			<p className='text-3xl font-black text-left pl-3'>Вам предоставлены следующие доступы в города:</p>
            <div className='flex justify-between my-4'>
                <div className='grid grid-cols-2'>
                    <label htmlFor="" className='text-left pl-5 font-medium'>Поиск по городу: </label>
                    <input onChange={(e) => setText(e.target.value)} type="text" placeholder="Город (default: ВСЕ)" className="block px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-secondary-foreground border-border focus:border-accent focus:outline-none focus:ring-0  peer" />
                </div>
                <div className='grid grid-cols-2'>
                    <label htmlFor="" className='text-right pr-2 font-medium'>Группы: </label>
                    <select onChange={(e) => setSelect(e.target.value)} className="select select-bordered w-full max-w-xs border-border bg-card" defaultValue={"All"}>
                        <option>All</option>
                        <option>Индивидуальные</option>
                        <option>Групповые</option>
                    </select>
                </div>
            </div>
			<table className="w-[99%] text-sm">
				<thead className='text-xs text-popover uppercase bg-muted-foreground'>
					<tr>
						<th className="w-[10%] p-2">ID</th>
						<th className="w-[20%] p-2">Группа</th>
						<th className="w-[35%] p-2">Город</th>
						<th className="w-[20%] p-2">Уровень</th>
						<th className="w-[15%] p-2">Доступ</th>
					</tr>
				</thead>
			</table>
            <div className="relative overflow-x-auto h-[calc(100%-110px)]">
                <table className="w-full text-sm">
                    <tbody className='text-foreground text-sm font-medium max-h-[70%]'>
                        {
							select === "All" ?
                            filter.map(accessCity =>
                                <tr className='border-b border-border' key={accessCity.id}>
                                    <th className='p-1 w-[10%]'>{accessCity.id}</th>
                                    <td className="w-[20%]">{accessCity.group}</td>
                                    <td className="w-[35%]">{accessCity.city}</td>
                                    <td className="w-[20%]">{accessCity.layer}</td>
                                    <td className="w-[15%]">{accessCity.access}</td>
                                </tr>
                            )
							:
							filteredGroupAccess.map(accessCity =>
								<tr className='border-b border-border' key={accessCity.id}>
									<th className='p-1'>{accessCity.id}</th>
									<td>{accessCity.group}</td>
									<td>{accessCity.city}</td>
									<td>{accessCity.layer}</td>
									<td>{accessCity.access}</td>
								</tr>
							)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserAccess;